MVP
[] Diamond index which pings stuller and returns a list of diamonds, filterable (reactively) by:
  [] Shape - Shape: [""]
  [] Carat - CaratWeight: [1, 5]
  [] Color - Letters D-Z with Z being the most yellow and D being nearly perfectly colorless - color: [""]
  [] Clarity - clarity: [IF/0, VVS1/1, VVS2/2, VS1/3, VS2/4, SI1/5, SI2/6, SI3/7, I1/8, I2/9, I3/10]
  [] Price - pricerange: [1, 20000]
  [] Cut Quality - cut: ["Ideal/0", Excellent/1, VeryGood/2, Good/3, Fair/4]
  [] Cut Style - NOT a query parameter...
  [] Flourescence - flouresence: [verystrong/0, strong/1, medium/2, faint/3, none/4]

[] Properly configure server
[] Build next page handler
[] Build error handling
[] Configure breakpoints -- Figma
[] Deploy to Azure, Hostinger, Northflank?

Components - 
[] GemView
[] GemItem
[] DetailsModal?
[] SideDetails


<!-- <div class="col-6">
        <!-- PriceRange -->
        <div class="filter-item">
          <label for="price_filter">Price</label>
          <input
            @change="updateDiamonds('PriceRange')"
            v-model="filterValues.PriceRange.max"
            type="range"
            :min="filterLabels.PriceRange.floor"
            :max="filterLabels.PriceRange.ceil"
            name="price_filter"
            list="priceList"
            step="10"
          />
          <datalist id="priceList">
            <option :value="filterLabels.PriceRange.values[0]">
              ${filterLabels.PriceRange.values[0]}$
            </option>
            <option :value="filterLabels.PriceRange.values[1]">
              ${filterLabels.PriceRange.values[1]}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- SizeRange -->
        <div class="filter-item">
          <label for="carat_filter">Carat</label>
          <input
            @change="updateDiamonds('Carat')"
            v-model="filterValues.SizeRange.max"
            type="range"
            :min="filterLabels.SizeRange.floor"
            :max="filterLabels.SizeRange.ceil"
            name="carat_filter"
            list="caratList"
            step="0.1"
          />
          <datalist id="caratList">
            <option :value="filterLabels.SizeRange.floor">
              ${filterLabels.SizeRange.floor}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.25">
              ${filterLabels.SizeRange.ceil * 0.25}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.5">
              ${filterLabels.SizeRange.ceil * 0.5}$
            </option>
            <option :value="filterLabels.SizeRange.ceil * 0.75">
              ${filterLabels.SizeRange.ceil * 0.75}$
            </option>
            <option :value="filterLabels.SizeRange.ceil">
              ${filterLabels.SizeRange.ceil + '.0'}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Cut -->
        <div class="filter-item">
          <label for="cut_filter">Cut</label>
          <input
            @change="updateDiamonds('Cut')"
            v-model="filterValues.Cut.max"
            type="range"
            :min="filterLabels.Cut.floor"
            :max="filterLabels.Cut.ceil"
            name="cut_filter"
            list="cutList"
          />
          <datalist id="cutList">
            <option
              v-for="(s, i) in filterLabels.Cut.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Color -->
        <div class="filter-item">
          <label for="color_filter">Color</label>
          <input
            @change="updateDiamonds('Color')"
            v-model="filterValues.Color.max"
            type="range"
            :min="filterLabels.Color.floor"
            :max="filterLabels.Color.ceil"
            name="color_filter"
            list="colorList"
          />
          <datalist id="colorList">
            <option
              v-for="(s, i) in filterLabels.Color.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Clarity -->
        <div class="filter-item">
          <label for="clarity_filter">Clarity</label>
          <input
            @change="updateDiamonds('Clarity')"
            v-model="filterValues.Clarity.max"
            type="range"
            :min="filterLabels.Clarity.floor"
            :max="filterLabels.Clarity.ceil"
            name="clarity_filter"
            list="clarityList"
          />
          <datalist id="clarityList">
            <option
              v-for="(s, i) in filterLabels.Clarity.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Polish -->
        <div class="filter-item">
          <label for="polish_filter">Polish</label>
          <input
            @change="updateDiamonds('Polish')"
            v-model="filterValues.Polish.max"
            type="range"
            :min="filterLabels.Polish.floor"
            :max="filterLabels.Polish.ceil"
            name="polish_filter"
            list="polishList"
          />
          <datalist id="polishList">
            <option
              v-for="(s, i) in filterLabels.Polish.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Symmetry -->
        <div class="filter-item">
          <label for="symmetry_filter">Symmetry</label>
          <input
            @change="updateDiamonds('Symmetry')"
            v-model="filterValues.Symmetry.max"
            type="range"
            :min="filterLabels.Symmetry.floor"
            :max="filterLabels.Symmetry.ceil"
            name="symmetry_filter"
            list="symmetryList"
          />
          <datalist id="symmetryList">
            <option
              v-for="(s, i) in filterLabels.Symmetry.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Fluorescence -->
        <div class="filter-item">
          <label for="fluor_filter">Fluorescence</label>
          <input
            @change="updateDiamonds('Fluorescence')"
            v-model="filterValues.Fluorescence.max"
            type="range"
            :min="filterLabels.Fluorescence.floor"
            :max="filterLabels.Fluorescence.ceil"
            name="fluor_filter"
            list="fluorList"
          />
          <datalist id="fluorList">
            <option
              v-for="(s, i) in filterLabels.Fluorescence.values"
              :key="s"
              :value="i"
              :label="s"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- L/w Ratio -->
        <div class="filter-item">
          <label for="lwr_filter">Length/Width Ratio</label>
          <input
            @change="updateDiamonds('LengthToWidthRatio')"
            v-model="filterValues.LengthToWidthRatio.max"
            type="range"
            :min="filterLabels.LengthToWidthRatio.floor"
            :max="filterLabels.LengthToWidthRatio.ceil"
            name="lwr_filter"
            list="lwrList"
            step="0.1"
          />
          <datalist id="lwrList">
            <option :value="filterLabels.LengthToWidthRatio.floor">
              ${filterLabels.LengthToWidthRatio.floor}$
            </option>
            <option value="1.0">1.0</option>
            <option value="2.0">2.0</option>
            <option :value="filterLabels.LengthToWidthRatio.ceil">
              ${filterLabels.LengthToWidthRatio.ceil + '.0'}$
            </option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Table % -->
        <div class="filter-item">
          <label for="table_filter">Table Percentage</label>
          <input
            @change="updateDiamonds('TablePercent')"
            v-model="filterValues.TablePercent.max"
            type="range"
            :min="filterLabels.TablePercent.floor"
            :max="filterLabels.TablePercent.ceil"
            name="table_filter"
            list="tableList"
            step="1"
          />
          <datalist id="tableList">
            <option value="0.1">${filterLabels.TablePercent.floor}$</option>
            <option value="50">${filterLabels.TablePercent.ceil/2}$</option>
            <option value="100">${filterLabels.TablePercent.ceil}$</option>
          </datalist>
        </div>
      </div>
      <div class="col-6">
        <!-- Depth % -->
        <div class="filter-item">
          <label for="depth_filter">Depth Percentage</label>
          <input
            @change="updateDiamonds('DepthPercent')"
            v-model="filterValues.DepthPercent.max"
            type="range"
            :min="filterLabels.DepthPercent.floor"
            :max="filterLabels.DepthPercent.ceil"
            name="depth_filter"
            list="depthList"
            step="1"
          />
          <datalist id="depthList">
            <option value="0.1">${filterLabels.DepthPercent.floor}$</option>
            <option value="50">${filterLabels.DepthPercent.ceil/2}$</option>
            <option value="100">${filterLabels.DepthPercent.ceil}$</option>
          </datalist>
        </div>
      </div> -->